const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

exports.handler = async (event) => {
  const operation = event.operation;
  const tableName = "Tasktable"; // Replace with your DynamoDB table name
  const documentClient = new AWS.DynamoDB.DocumentClient();

  if (operation === "add") {
    const taskId = uuidv4(); // Generate a unique task ID
    const task = JSON.parse(event.body);

    const params = {
      TableName: tableName,
      Item: {
        taskId,
        taskName: task.taskName,
        taskDescription: task.taskDescription,
      },
    };

    try {
      await documentClient.put(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Task added successfully" }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to add task" }),
      };
    }
  } else if (operation === "edit") {
    const taskId = event.taskId;
    const task = JSON.parse(event.body);

    const params = {
      TableName: tableName,
      Key: { taskId },
      UpdateExpression: "set taskName = :name, taskDescription = :description",
      ExpressionAttributeValues: {
        ":name": task.taskName,
        ":description": task.taskDescription,
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      const result = await documentClient.update(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Task updated successfully",
          updatedItem: result.Attributes,
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to update task" }),
      };
    }
  } else if (operation === "delete") {
    const taskId = event.taskId;

    const params = {
      TableName: tableName,
      Key: { taskId },
    };

    try {
      await documentClient.delete(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Task deleted successfully" }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to delete task" }),
      };
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid operation" }),
    };
  }
};
