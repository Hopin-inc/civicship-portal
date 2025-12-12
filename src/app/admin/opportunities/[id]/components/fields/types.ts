import type {
  OpportunityFormInstance,
  OpportunityFormValues,
} from "../../hooks/useOpportunityForm";

export type FieldProps = {
  form: OpportunityFormInstance;
};
export type Option = { value: string; label: string };

export type CategoryFieldProps = FieldProps & {
  categories: { value: OpportunityFormValues["category"]; label: string }[];
};

export type HostUserFieldProps = FieldProps & {
  hosts: { id: string; name: string }[];
};

export type PlaceFieldProps = FieldProps & {
  places: { id: string; label: string }[];
};
