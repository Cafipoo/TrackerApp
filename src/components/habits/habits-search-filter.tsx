"use client"

import { useState } from "react"
import { Search, Filter, X, SortAsc, SortDesc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CATEGORIES } from "@/components/ui/category-icon"

interface SearchFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedFrequency: string
  setSelectedFrequency: (frequency: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  onClearFilters: () => void
}

export function HabitsSearchFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedFrequency,
  setSelectedFrequency,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onClearFilters
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedFrequency !== "all"

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    // Toggle order when clicking the same sort option
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortOrder("asc")
    }
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher une habitude..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtres et tri */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Filtres */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
              {hasActiveFilters && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {[searchTerm, selectedCategory !== "all", selectedFrequency !== "all"].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Filtres</h4>
              
              {/* Catégorie */}
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fréquence */}
              <div className="space-y-2">
                <Label htmlFor="frequency">Fréquence</Label>
                <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les fréquences" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les fréquences</SelectItem>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="flex-1"
                >
                  Effacer
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1"
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Tri */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Trier par:</Label>
          <div className="flex gap-1">
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("name")}
            >
              Nom
              {sortBy === "name" && (
                sortOrder === "asc" ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
              )}
            </Button>
            <Button
              variant={sortBy === "createdAt" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("createdAt")}
            >
              Date
              {sortBy === "createdAt" && (
                sortOrder === "asc" ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
              )}
            </Button>
            <Button
              variant={sortBy === "frequency" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("frequency")}
            >
              Fréquence
              {sortBy === "frequency" && (
                sortOrder === "asc" ? <SortAsc className="ml-1 h-3 w-3" /> : <SortDesc className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Effacer tous les filtres */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer tout
          </Button>
        )}
      </div>
    </div>
  )
}
