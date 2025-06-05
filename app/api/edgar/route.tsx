// File: app/api/edgar/route.ts

import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

const SEC_ARCHIVE = "https://www.sec.gov/Archives";

type CikEntry = {
  cik_str: string;
  ticker: string;
  title: string;
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCIK(ticker: string): Promise<string | null> {
  const cikMapUrl = "https://www.sec.gov/files/company_tickers.json";
  const headers = {
    "User-Agent": "10-K Analyzer (amcnicholl02@gmail.com)",
    "Accept-Encoding": "gzip, deflate",
  };
  const res = await axios.get(cikMapUrl, { headers });
  const cikMap = res.data;

  const match = Object.values(cikMap).find((entry) => {
    const cikEntry = entry as CikEntry;
    return cikEntry.ticker.toLowerCase() === ticker.toLowerCase();
  });

  return match ? String((match as CikEntry).cik_str).padStart(10, "0") : null;
}

async function getFilingURL(cik: string, year: number): Promise<string | null> {
  const headers = {
    "User-Agent": "10-K Analyzer (amcnicholl02@gmail.com)",
    "Accept-Encoding": "gzip, deflate",
  };
  const indexUrl = `https://data.sec.gov/submissions/CIK${cik}.json`;
  const { data } = await axios.get(indexUrl, { headers });

  const filings = data.filings.recent;
  for (let i = 0; i < filings.form.length; i++) {
    if (
      filings.form[i] === "10-K" &&
      filings.filingDate[i]?.startsWith(year.toString())
    ) {
      const accession = filings.accessionNumber[i].replace(/-/g, "");
      const url = `${SEC_ARCHIVE}/edgar/data/${parseInt(cik)}/${accession}/${filings.primaryDocument[i]}`;
      return url;
    }
  }
  return null;
}

async function extractSectionFromHTML(url: string, sectionTitle: string): Promise<string | null> {
  const headers = {
    "User-Agent": "10-K Analyzer (amcnicholl02@gmail.com)",
    "Accept-Encoding": "gzip, deflate",
  };

  const { data: html } = await axios.get(url, { headers });
  const $ = cheerio.load(html);
  const text = $("body").text();

  const regexMap: Record<string, string> = {
    "Item 1": "Item\\s+1\\.?\\s*Business[\\s\\S]*?(?=Item\\s+1A\\.?|Item\\s+2\\.?|SIGNATURES|$)",
    "Item 1A": "Item\\s+1A\\.?\\s*Risk Factors[\\s\\S]*?(?=Item\\s+1B\\.?|Item\\s+2\\.?|SIGNATURES|$)",
    "Item 7": "Item\\s+7\\.?\\s*Management[\\s\\S]*?(?=Item\\s+7A\\.?|Item\\s+8\\.?|SIGNATURES|$)",
    "Item": "Item\\s+\\d+[\\s\\S]*?(?=Item\\s+\\d+|PART\\s+\\w+|SIGNATURES|$)"
  };

  const sectionMap: Record<string, string> = {
    overview: "Item 1",
    "risk factors": "Item 1A",
    financials: "Item 7",
    all: "Item",
  };

  const normalized = sectionMap[sectionTitle.toLowerCase()] || "Item";
  const pattern = regexMap[normalized] || regexMap["Item"];
  const sectionRegex = new RegExp(pattern, "i");

  const normalizedText = text.replace(/\s+/g, " ").replace(/\u00a0/g, " ");
  const match = normalizedText.match(sectionRegex);

  return match ? match[0].trim() : null;
}

export async function POST(req: Request) {
  try {
    const { ticker, year, section } = await req.json();

    if (!ticker || !year || !section) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const cik = await getCIK(ticker);
    if (!cik) return NextResponse.json({ error: "Invalid ticker" }, { status: 404 });

    const filingUrl = await getFilingURL(cik, year);
    if (!filingUrl) return NextResponse.json({ error: "10-K not found" }, { status: 404 });

    const sectionText = await extractSectionFromHTML(filingUrl, section);
    if (!sectionText) return NextResponse.json({ error: "Section not found" }, { status: 404 });

    return NextResponse.json({ cik, filingUrl, section, sectionText });
  } catch (error) {
    console.error("EDGAR API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
