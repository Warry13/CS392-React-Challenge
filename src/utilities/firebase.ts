import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyBVewfypqAMfm0H8uUjCB4dEse2jho_qXQ",
  authDomain: "schedules-ee853.firebaseapp.com",
  databaseURL: "https://schedules-ee853-default-rtdb.firebaseio.com",
  projectId: "schedules-ee853",
  storageBucket: "schedules-ee853.firebasestorage.app",
  messagingSenderId: "924501008071",
  appId: "1:924501008071:web:326e8f0b845ffdcaf1a8e2"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function useDbData<T = unknown>(path: string): [T | undefined, boolean, Error | null] {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const dbRef = ref(database, path);
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        setData(snapshot.val() as T);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]);

  return [data, loading, error];
}

export { app, database };