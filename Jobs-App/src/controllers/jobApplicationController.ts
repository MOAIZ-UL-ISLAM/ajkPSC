// import { Request, Response } from 'express';
// import { JobApplication } from '../models/jobApplication.model';
// import { validatePersonalInfo, validateEducation, validateExperience } from '../utils/validation';
// import { AuthRequest } from '../middleware/auth.middleware';

// export const createPersonalInfo = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     console.log("Raw Request Body:", req.body);
//     const userId = req.user?.userId;
//     const personalInfo = validatePersonalInfo(req.body);

//     const application = await JobApplication.create({
//       userId,
//       personalInfo,
//       education: [],
//       status: 'draft'
//     });

//     res.status(201).json({ 
//       message: 'Personal information saved successfully',
//       applicationId: application._id 
//     });
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//     console.error(error);
//   }
// };

// export const addEducation = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const { applicationId } = req.params;
//     const userId = req.user?.userId;
//     const educationData = validateEducation(req.body);

//     const application = await JobApplication.findOne({ _id: applicationId, userId });
//     if (!application) {
//       res.status(404).json({ message: 'Application not found' });
//       return;
//     }

//     application.education.push(educationData);
//     await application.save();

//     res.json({ 
//       message: 'Education information added successfully',
//       education: application.education 
//     });
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// };



// export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const { applicationId } = req.params;
//     const userId = req.user?.userId;

//     const application = await JobApplication.findOne({ _id: applicationId, userId });
//     if (!application) {
//       res.status(404).json({ message: 'Application not found' });
//       return;
//     }

//     // Validate complete application
//     if (!application.personalInfo || application.education.length === 0) {
//       res.status(400).json({ message: 'Personal info and education are required' });
//       return;
//     }

//     application.status = 'submitted';
//     await application.save();

//     res.json({ 
//       message: 'Application submitted successfully',
//       application 
//     });
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// };





import { Request, Response } from 'express';
import { JobApplication } from '../models/jobApplication.model';
import { validatePersonalInfo, validateEducation, validateExperience } from '../utils/validation';
import { AuthRequest } from '../middleware/auth.middleware';

export const createPersonalInfo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log("Raw Request Body:", req.body);
    const userId = req.user?.userId;
    const personalInfo = validatePersonalInfo(req.body);

    // Create a new application document without validation
    const [application] = await JobApplication.create([{
      userId,
      personalInfo,
      education: [], // Initialize empty education array
      status: 'draft'
    }], { validateBeforeSave: false }); // Skip validation on initial creation

    res.status(201).json({ 
      message: 'Personal information saved successfully',
      applicationId: application._id 
    });
  } catch (error: any) {
    console.error('Error in createPersonalInfo:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors ? Object.values(error.errors).map((err: any) => err.message) : undefined
    });
  }
};

export const addEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log("education Request Body:", req.body);
    const { applicationId } = req.params;
    console.log(applicationId);
    
    const userId = req.user?.userId;
    const educationData = validateEducation(req.body);

    const application = await JobApplication.findOne({ _id: applicationId });
    console.log(application);
    
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    application.education.push(educationData);
    
    // Run validation only on the education array
    const validationError = application.validateSync('education');
    if (validationError) {
      res.status(400).json({ 
        message: 'Validation failed',
        details: Object.values(validationError.errors).map(err => err.message)
      });
      return;
    }

    await application.save();

    res.json({ 
      message: 'Education information added successfully',
      education: application.education 
    });
  } catch (error: any) {
    console.error('Error in addEducation:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors ? Object.values(error.errors).map((err: any) => err.message) : undefined
    });
  }
};



export const addExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const userId = req.user?.userId;
    const experienceData = validateExperience(req.body);

    const application = await JobApplication.findOne({ _id: applicationId });
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    application.experience.push(experienceData);
    await application.save();

    res.json({ 
      message: 'Experience information added successfully',
      experience: application.experience 
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};





export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const userId = req.user?.userId;

    const application = await JobApplication.findOne({ _id: applicationId });
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    // Run full validation before submission
    const validationError = application.validateSync();
    if (validationError) {
      res.status(400).json({ 
        message: 'Application validation failed',
        details: Object.values(validationError.errors).map(err => err.message)
      });
      return;
    }

    application.status = 'submitted';
    await application.save();

    res.json({ 
      message: 'Application submitted successfully',
      application 
    });
  } catch (error: any) {
    console.error('Error in submitApplication:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors ? Object.values(error.errors).map((err: any) => err.message) : undefined
    });
  }
};


export const getApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const userId = req.user?.userId;

    const application = await JobApplication.findOne({ _id: applicationId });
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json(application);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};