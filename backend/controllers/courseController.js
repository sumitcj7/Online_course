import { Course } from "../models/courseModel.js";
import { User } from "../models/userModel.js";

const createCourse=async(req,res)=>{
    try{
        
        const {title,description,price,category,level}=req.body;
        const newcourse= new Course({
            title,description,price,category,level,instructor:req.user._id
        })
       const savedCourse= await newcourse.save();
//adding courses to user createdCourse
await User.findByIdAndUpdate(req.user._id,{
    $push:{createdCourses:savedCourse._id}
})
res.status(200).json({
    message:"Courses created and saved"
})
    }catch(err){
    res.status(500).json({
        message:`Server Error: ${err.message}`
    })
    }
}
const getAllCourse=async(req,res)=>{
    try {
        const course= await Course.find().populate('instructor','name email').sort({createdAt:-1});
        res.status(200).json(course)
        
    } catch (error) {
        res.status(500).json({
            message:'Failed to fetch course',
            err:error.message
        })
    }
}

const enrolledInCourses=async(req,res)=>{
try {
   const courseid= req.params.id;
    const course=await Course.findById(courseid);
    if(!course){
        return res.status(404).json({
            message:'Course not found'
        })
    }
    if(course.enrolledStudents.includes(req.user._id)){
        return res.status(400).json({
            message:"Already enrolled"
        })
    }
    course.enrolledStudents.push(req.user._id)
    await course.save();

 //adding course to student list
 await User.findByIdAndUpdate(req.user._id, {
  $addToSet: { enrolledCourses: course._id }  
});

 res.status(200).json({
    message:"Enrolled successfully"
 })
 
} catch (error) {
    res.status(500).json({
        message:'Failed to enroll student',
        error:error.message
    })
}
    
}
const getMycourse = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      populate: { path: 'instructor', select: 'name' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.enrolledCourses); //  should be an array
  } catch (error) {
    res.status(500).json({
      message: 'Unable to fetch enrolled courses',
      error: error.message
    });
  }
};


export{createCourse,getAllCourse,getMycourse,enrolledInCourses}