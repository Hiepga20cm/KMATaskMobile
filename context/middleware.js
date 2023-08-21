// import { admin } from '../firebase/firebaseConfig'

// // Xác thực token của người dùng bất đồng bộ
// export const verifyToken = async (idToken) => {
//     try {
//         const decodedToken = await admin.auth().verifyIdToken(idToken)
//         const uid = decodedToken.uid
//         console.log('Token của người dùng đã được xác thực:', uid)
//         return uid
//         // Thực hiện các thao tác khác với decodedToken ở đây
//     } catch (error) {
//         console.error('Lỗi xác thực token:', error)
//     }
// }
