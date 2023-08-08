const Project = require('../models/Project');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('customer').populate('manager');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
};

// Get a project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('customer').populate('manager');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project' });
  }
};

const AutoIncrement = require('../models/AutoIncrement');

// Get the next sequence number 
const getNextSequence = async (name) => {
  const result = await AutoIncrement.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
};



// Create a new project
exports.createProject = async (req, res) => {
  try {
    const id = await getNextSequence('project');
    const newProject = await Project.create({ _id: id, ...req.body });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project', message: error.message  });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('customer')
      .populate('manager');
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Error updating project' });
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};
