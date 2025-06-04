export interface Crop {
  id: string;
  name: string;
  description?: string;
}

export interface CreateCropDto {
  name: string;
  description?: string;
}

export interface UpdateCropDto {
  name?: string;
  description?: string;
}

export interface Harvest {
  id: string;
  year: number;
  farmId: string;
  cropId: string;
  farm?: {
    id: string;
    name: string;
  };
  crop?: Crop;
}

export interface CreateHarvestDto {
  year: number;
  farmId: string;
  cropId: string;
}

export interface UpdateHarvestDto {
  year?: number;
  farmId?: string;
  cropId?: string;
} 