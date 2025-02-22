"use client"

import React, { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"

interface ContactFormProps {
  onError: (errorMessage: string) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onError }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("") // New state variable

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault() // Prevent default form submission
    setPending(true)
    setMessage("")
    setErrorMessage("") // Clear previous messages

    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage("All fields are required.")
      setPending(false)
      return
    }

    try {
      console.log("Submitting form data:", formData) // Log form data
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log("Response received:", response) // Log response
      console.log("Result received:", result) // Log result

      if (response.ok) {
        setMessage("Message sent successfully!")
      } else {
        console.error("Error response:", result);
        setErrorMessage(result.error || `Error: ${response.status} ${response.statusText}`) // Set error message
        onError(result.error || `Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage(`Error: ${error.message}`) // Set detailed error message
      onError(`Error: ${error.message}`);
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending..." : "Send Message"}
        </Button>
        {message && <p className="text-sm text-center mt-4 text-muted-foreground">{message}</p>}
        {errorMessage && <p className="text-sm text-center mt-4 text-red-500">{errorMessage}</p>} {/* Display error message */}
      </form>
    </Card>
  )
}

export default ContactForm;
