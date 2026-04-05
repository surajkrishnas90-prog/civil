import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, limit, startAfter, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

// --- User ---
export const createUserProfile = async (uid, data) => {
  await setDoc(doc(db, "users", uid), data, { merge: true });
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), data);
};

// --- Engineers list with pagination ---
export const getEngineers = async () => {
  const snap = await getDocs(collection(db, "users"));
  const engineers = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((u) => u.role === "engineer");
  return { engineers, lastDoc: null, hasMore: false };
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// --- Projects ---
export const createProject = async (data) => {
  const ref = doc(collection(db, "projects"));
  await setDoc(ref, { ...data, createdAt: new Date() });
  return ref.id;
};

export const getUserProjects = async (userId) => {
  const q = query(collection(db, "projects"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getAllProjects = async () => {
  const snap = await getDocs(collection(db, "projects"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteProject = async (projectId) => {
  await deleteDoc(doc(db, "projects", projectId));
};

// --- KYC ---
export const submitKyc = async (userId, documentUrl) => {
  await setDoc(doc(db, "kyc", userId), {
    userId,
    documentUrl,
    status: "pending",
    submittedAt: new Date(),
  });
  await updateUserProfile(userId, { kycStatus: "pending" });
};

export const getKycSubmissions = async () => {
  const snap = await getDocs(collection(db, "kyc"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateKycStatus = async (userId, status) => {
  await updateDoc(doc(db, "kyc", userId), { status });
  await updateUserProfile(userId, {
    kycStatus: status,
    isVerified: status === "approved",
  });
};
