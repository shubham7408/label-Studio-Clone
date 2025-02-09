// const host = "http://13.202.236.112:3001/api/"
 const host = "http://localhost:3001/api/"
export const authorizedPost = async (link, data) => {
  const token = localStorage.getItem('token');
  return await fetch(host + link, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export const authorizedPostMedia = async (link, data, timeout = 5000) => {
  const token = localStorage.getItem('token');
  
  // Create a promise that rejects after a specified timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), timeout)
  );

  // Use Promise.race to race between the fetch request and the timeout
  const fetchPromise = fetch(host + link, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });

  try {
    // The race will resolve with whichever promise completes first
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    // Handle the error (timeout or network error)
    console.error('Error:', error);
    throw error;  // Re-throw the error after logging it
  }
};

export const authorizedPut = async (link, data) => {
  const token = localStorage.getItem('token');
  return await fetch(host + link, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}


export const post = async (link, data) => {
  return await fetch(host + link, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export const authorizedGet = async (link) => {
  const token = localStorage.getItem('token');
  // console.log(token);
  return await fetch(host + link, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
}