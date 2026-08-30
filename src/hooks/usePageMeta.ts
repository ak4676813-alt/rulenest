import { useEffect } from "react"

/**
 * Sets the document title, meta description, and Open Graph title/description
 * for a page and restores sensible defaults on unmount.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!meta) {
        meta = document.createElement("meta")
        meta.name = "description"
        document.head.appendChild(meta)
      }
      meta.content = description

      let og = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
      if (!og) {
        og = document.createElement("meta")
        og.setAttribute("property", "og:description")
        document.head.appendChild(og)
      }
      og.content = description
    }
    return () => {
      document.title = "RuleNest — Rental Property Compliance Software for Landlords"
    }
  }, [title, description])
}