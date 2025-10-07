import { EducationRepo } from "./repo";
export const EducationService = {
  list: () => EducationRepo.list(),
  get: (idOrSlug: string) =>
    isNaN(Number(idOrSlug))
      ? EducationRepo.bySlug(idOrSlug)
      : EducationRepo.byId(Number(idOrSlug)),
};
