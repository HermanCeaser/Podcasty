import React from 'react'
import { Category } from '@/data/categories';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



const  CategorySelect: React.FC<{name: string, options: Category[], isRequired: boolean | undefined}> = ({name, options, isRequired=false}) => {
  return (
    <Select name={name} required={isRequired}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Category</SelectLabel>
          {options.map((category) => (
            <SelectItem key={category.id} value={category.name.toLowerCase()}>{category.name.toUpperCase()}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default CategorySelect
