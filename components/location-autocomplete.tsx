"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationSuggestion {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  name?: string
  id?: string
  required?: boolean
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Ciudad, País",
  disabled = false,
  className,
  name,
  id,
  required = false,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Simulated location data - in production, you'd use Google Places API
  const mockLocations = [
    {
      place_id: "1",
      description: "Buenos Aires, Argentina",
      structured_formatting: { main_text: "Buenos Aires", secondary_text: "Argentina" },
    },
    {
      place_id: "2",
      description: "Córdoba, Argentina",
      structured_formatting: { main_text: "Córdoba", secondary_text: "Argentina" },
    },
    {
      place_id: "3",
      description: "Rosario, Argentina",
      structured_formatting: { main_text: "Rosario", secondary_text: "Argentina" },
    },
    {
      place_id: "4",
      description: "Mendoza, Argentina",
      structured_formatting: { main_text: "Mendoza", secondary_text: "Argentina" },
    },
    {
      place_id: "5",
      description: "La Plata, Argentina",
      structured_formatting: { main_text: "La Plata", secondary_text: "Argentina" },
    },
    {
      place_id: "6",
      description: "Santiago, Chile",
      structured_formatting: { main_text: "Santiago", secondary_text: "Chile" },
    },
    {
      place_id: "7",
      description: "Valparaíso, Chile",
      structured_formatting: { main_text: "Valparaíso", secondary_text: "Chile" },
    },
    {
      place_id: "8",
      description: "Concepción, Chile",
      structured_formatting: { main_text: "Concepción", secondary_text: "Chile" },
    },
    { place_id: "9", description: "Lima, Perú", structured_formatting: { main_text: "Lima", secondary_text: "Perú" } },
    {
      place_id: "10",
      description: "Arequipa, Perú",
      structured_formatting: { main_text: "Arequipa", secondary_text: "Perú" },
    },
    {
      place_id: "11",
      description: "Bogotá, Colombia",
      structured_formatting: { main_text: "Bogotá", secondary_text: "Colombia" },
    },
    {
      place_id: "12",
      description: "Medellín, Colombia",
      structured_formatting: { main_text: "Medellín", secondary_text: "Colombia" },
    },
    {
      place_id: "13",
      description: "Cali, Colombia",
      structured_formatting: { main_text: "Cali", secondary_text: "Colombia" },
    },
    {
      place_id: "14",
      description: "Quito, Ecuador",
      structured_formatting: { main_text: "Quito", secondary_text: "Ecuador" },
    },
    {
      place_id: "15",
      description: "Guayaquil, Ecuador",
      structured_formatting: { main_text: "Guayaquil", secondary_text: "Ecuador" },
    },
    {
      place_id: "16",
      description: "Caracas, Venezuela",
      structured_formatting: { main_text: "Caracas", secondary_text: "Venezuela" },
    },
    {
      place_id: "17",
      description: "Maracaibo, Venezuela",
      structured_formatting: { main_text: "Maracaibo", secondary_text: "Venezuela" },
    },
    {
      place_id: "18",
      description: "La Paz, Bolivia",
      structured_formatting: { main_text: "La Paz", secondary_text: "Bolivia" },
    },
    {
      place_id: "19",
      description: "Santa Cruz, Bolivia",
      structured_formatting: { main_text: "Santa Cruz", secondary_text: "Bolivia" },
    },
    {
      place_id: "20",
      description: "Asunción, Paraguay",
      structured_formatting: { main_text: "Asunción", secondary_text: "Paraguay" },
    },
    {
      place_id: "21",
      description: "Montevideo, Uruguay",
      structured_formatting: { main_text: "Montevideo", secondary_text: "Uruguay" },
    },
    {
      place_id: "22",
      description: "Ciudad de México, México",
      structured_formatting: { main_text: "Ciudad de México", secondary_text: "México" },
    },
    {
      place_id: "23",
      description: "Guadalajara, México",
      structured_formatting: { main_text: "Guadalajara", secondary_text: "México" },
    },
    {
      place_id: "24",
      description: "Monterrey, México",
      structured_formatting: { main_text: "Monterrey", secondary_text: "México" },
    },
    {
      place_id: "25",
      description: "Madrid, España",
      structured_formatting: { main_text: "Madrid", secondary_text: "España" },
    },
    {
      place_id: "26",
      description: "Barcelona, España",
      structured_formatting: { main_text: "Barcelona", secondary_text: "España" },
    },
    {
      place_id: "27",
      description: "Valencia, España",
      structured_formatting: { main_text: "Valencia", secondary_text: "España" },
    },
    {
      place_id: "28",
      description: "Sevilla, España",
      structured_formatting: { main_text: "Sevilla", secondary_text: "España" },
    },
    {
      place_id: "29",
      description: "Miami, Estados Unidos",
      structured_formatting: { main_text: "Miami", secondary_text: "Estados Unidos" },
    },
    {
      place_id: "30",
      description: "Nueva York, Estados Unidos",
      structured_formatting: { main_text: "Nueva York", secondary_text: "Estados Unidos" },
    },
    {
      place_id: "31",
      description: "Los Ángeles, Estados Unidos",
      structured_formatting: { main_text: "Los Ángeles", secondary_text: "Estados Unidos" },
    },
    {
      place_id: "32",
      description: "São Paulo, Brasil",
      structured_formatting: { main_text: "São Paulo", secondary_text: "Brasil" },
    },
    {
      place_id: "33",
      description: "Río de Janeiro, Brasil",
      structured_formatting: { main_text: "Río de Janeiro", secondary_text: "Brasil" },
    },
    {
      place_id: "34",
      description: "Brasília, Brasil",
      structured_formatting: { main_text: "Brasília", secondary_text: "Brasil" },
    },
  ]

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Filter mock locations based on query
    const filtered = mockLocations
      .filter(
        (location) =>
          location.description.toLowerCase().includes(query.toLowerCase()) ||
          location.structured_formatting.main_text.toLowerCase().includes(query.toLowerCase()) ||
          location.structured_formatting.secondary_text.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 8) // Limit to 8 suggestions

    setSuggestions(filtered)
    setIsLoading(false)
    setShowSuggestions(true)
    setSelectedIndex(-1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    searchLocations(newValue)
  }

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onChange(suggestion.description)
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex])
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }, 200)
  }

  const handleFocus = () => {
    if (value.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={cn("pl-10 pr-10", className)}
          disabled={disabled}
          required={required}
          autoComplete="address-level2"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              className={cn(
                "px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0",
                selectedIndex === index && "bg-blue-50 hover:bg-blue-50",
              )}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && value.length >= 2 && suggestions.length === 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <div className="px-4 py-3 text-sm text-gray-500 text-center">No se encontraron ubicaciones</div>
        </div>
      )}
    </div>
  )
}
