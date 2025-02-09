const connectToDatabase = require('./connectDB');

  const addEmployees = async () => {
    try {
        const id='67439d93cc666793794c85bc'
      const db = await connectToDatabase();
      const employeesCollection = db.collection("employees");
    const employees = await employeesCollection.find({_id: id}).toArray();

      console.log('Employees added successfully', employees);
    } catch (error) {
      console.error("Failed to insert employees", error);
    }
  };

  addEmployees();