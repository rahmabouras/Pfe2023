const Issue = require('../models/Issue');
const Project = require('../models/Project');

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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

const createIssue = async (req, res) => {
  try {
    const id = await getNextSequence('issue');
    const _id = id;
    const { title, type, status, priority, listPosition, description, estimate, timeSpent, reporterId, projectId, userIds, start, end } = req.body;

    // Create the new Issue
    const newIssue = new Issue({
      _id,
      title,
      type,
      status,
      priority,
      listPosition,
      description,
      estimate,
      timeSpent,
      reporterId,
      projectId,
      userIds,
      start,
      end
    });

    // Save the new Issue
    await newIssue.save();

    // Associate the Issue with the Project
    const projectToUpdate = await Project.findById(projectId);
    projectToUpdate.issues.push(newIssue._id);
    await projectToUpdate.save();

    res.json({ message: 'Issue created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = {
  createIssue
};


const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedIssueData = req.body;

    const issue = await Issue.findById(id);

    if (updatedIssueData.progress) {
      
      if ( issue.timeRemaining )
      {
        const totalTime = issue.timeSpent + issue.timeRemaining
        updatedIssueData.timeSpent = Math.round( totalTime * updatedIssueData.progress / 100);
        updatedIssueData.timeRemaining = totalTime - updatedIssueData.timeSpent;
      }
      else
      updatedIssueData.timeSpent = Math.round( issue.estimate * updatedIssueData.progress / 100);
    }

    // Update the issue with the new data
    const updatedIssue = await Issue.findByIdAndUpdate(id, updatedIssueData, { new: true });
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    await Issue.findByIdAndDelete(id);
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
};
