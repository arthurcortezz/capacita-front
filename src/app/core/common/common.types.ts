export interface CityInterface {
  id?: number;
  name: string;
  stateId: number;
  state?: StateInterface;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface StateInterface {
  id?: number;
  name: string;
  uf: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ViaCEPResponseInterface {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
