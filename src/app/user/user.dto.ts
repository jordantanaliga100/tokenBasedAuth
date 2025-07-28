// src/dtos/user.dto.ts

export interface CreateDto {
  name: string;
  email: string;
  // pwede ka magdagdag dito ng iba pang fields kung meron
}

export interface UpdateDto {
  name?: string; // optional kasi pwedeng i-partial update
  email?: string;
}
