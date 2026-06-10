import { Router } from 'express';
import { RegistrationController } from '../controllers/RegistrationController';

const registrationRouter: Router = Router();

registrationRouter.get('/registrations', RegistrationController.getAllRegistrations);
registrationRouter.get('/registrations/:id', RegistrationController.getRegistrationById);
registrationRouter.post('/registrations', RegistrationController.createRegistration);
registrationRouter.put('/registrations/:id', RegistrationController.updateRegistration);
registrationRouter.delete('/registrations/:id', RegistrationController.deleteRegistration);

export default registrationRouter;
