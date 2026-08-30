import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "./ui/Button"
import { Field, Input, Select } from "./ui/Input"
import Modal from "./ui/Modal"
import { useData } from "../context/DataContext"
import { useToast } from "../context/ToastContext"

const PROPERTY_TYPES = ["Single-family", "Multi-family", "Condo unit", "Townhouse", "Duplex"]
const RENTAL_TYPES = ["Long-term rental", "Short-term rental", "Mixed use"]

interface AddPropertyModalProps {
  open: boolean
  onClose: () => void
}

export default function AddPropertyModal({ open, onClose }: AddPropertyModalProps) {
  const { addProperty } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    units: "1",
    yearBuilt: "1990",
    propertyType: PROPERTY_TYPES[0],
    rentalType: RENTAL_TYPES[0],
    ownerOccupied: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.address.trim()) next.address = "Street address is required."
    if (!form.city.trim()) next.city = "City is required."
    if (!form.state.trim()) next.state = "State is required."
    const units = Number(form.units)
    if (!Number.isFinite(units) || units < 1 || units > 200) next.units = "Enter 1–200 units."
    const year = Number(form.yearBuilt)
    if (!Number.isFinite(year) || year < 1700 || year > new Date().getFullYear()) {
      next.yearBuilt = "Enter a valid year."
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setSubmitting(true)
    // Simulate the short "building your Property DNA" step.
    window.setTimeout(() => {
      const property = addProperty({
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        units: Number(form.units),
        yearBuilt: Number(form.yearBuilt),
        propertyType: form.propertyType,
        rentalType: form.rentalType,
        ownerOccupied: form.ownerOccupied,
      })
      setSubmitting(false)
      onClose()
      toast({
        variant: "success",
        title: "Property added",
        description: `${property.address} — Property DNA created with starter requirements.`,
      })
      navigate(`/app/properties/${property.id}`)
    }, 900)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add property"
      subtitle="Enter the address and basics — RuleNest builds the Property DNA and identifies the requirements that may apply."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={submitting}>
            {submitting ? "Building Property DNA…" : "Add property"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Street address" htmlFor="ap-address" error={errors.address}>
          <Input
            id="ap-address"
            placeholder="123 Main Street"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            autoFocus
          />
        </Field>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="City" htmlFor="ap-city" error={errors.city}>
            <Input
              id="ap-city"
              placeholder="Boston"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            />
          </Field>
          <Field label="State" htmlFor="ap-state" error={errors.state}>
            <Input
              id="ap-state"
              placeholder="MA"
              maxLength={2}
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
            />
          </Field>
          <Field label="ZIP" htmlFor="ap-zip" error={errors.zip}>
            <Input
              id="ap-zip"
              placeholder="02118"
              value={form.zip}
              onChange={(e) => set("zip", e.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Units" htmlFor="ap-units" error={errors.units}>
            <Input
              id="ap-units"
              type="number"
              min={1}
              value={form.units}
              onChange={(e) => set("units", e.target.value)}
            />
          </Field>
          <Field label="Year built" htmlFor="ap-year" error={errors.yearBuilt}>
            <Input
              id="ap-year"
              type="number"
              value={form.yearBuilt}
              onChange={(e) => set("yearBuilt", e.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Property type" htmlFor="ap-type">
            <Select
              id="ap-type"
              value={form.propertyType}
              onChange={(e) => set("propertyType", e.target.value)}
              options={PROPERTY_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </Field>
          <Field label="Rental type" htmlFor="ap-rental">
            <Select
              id="ap-rental"
              value={form.rentalType}
              onChange={(e) => set("rentalType", e.target.value)}
              options={RENTAL_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </Field>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            checked={form.ownerOccupied}
            onChange={(e) => set("ownerOccupied", e.target.checked)}
          />
          I live in one of the units (owner-occupied)
        </label>
      </div>
    </Modal>
  )
}