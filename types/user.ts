export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface Guest {
  guestId: string;
  tenantId: string;
}
