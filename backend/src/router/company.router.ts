import { Router } from 'express';
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from '../controller/company.controller';

const router = Router();

router.post('/create-company', createCompany);

router.get('/all-companies', getAllCompanies);

router.get('/get-company-byId/:id', getCompanyById);

router.put('/update-company/:id', updateCompany);

router.delete('/delete-company/:id', deleteCompany);

export default router;