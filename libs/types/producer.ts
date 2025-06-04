export interface Producer {
  id: string;
  name: string;
  document: string; // CPF ou CNPJ
  city: string;
  state: string;
  farms?: Farm[];
}

export interface CreateProducerDto {
  name: string;
  document: string;
  city: string;
  state: string;
}

export interface UpdateProducerDto {
  name?: string;
  document?: string;
  city?: string;
  state?: string;
}

export interface Farm {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number; // área agricultável
  vegetationArea: number; // área de vegetação
  producerId: string;
  producer?: Producer;
  harvests?: Harvest[];
}

export interface CreateFarmDto {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  producerId: string;
}

export interface UpdateFarmDto {
  name?: string;
  city?: string;
  state?: string;
  totalArea?: number;
  arableArea?: number;
  vegetationArea?: number;
}

export interface Harvest {
  id: string;
  year: number;
  farmId: string;
  farm?: Farm;
  crops?: Crop[];
}

export interface Crop {
  id: string;
  name: string;
  harvestId: string;
  harvest?: Harvest;
}

// Tipos para o dashboard
export interface DashboardStats {
  totalFarms: number;
  totalHectares: number;
  farmsByState: Array<{ state: string; count: number }>;
  farmsByCrop: Array<{ crop: string; count: number }>;
  landUse: Array<{ type: 'arable' | 'vegetation'; hectares: number }>;
} 