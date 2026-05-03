import { auth, db } from './firebase-config.js'
import { createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js'
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js'

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('form')

    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault()

        const inputs = registerForm.querySelectorAll('input')

        const name = inputs[0].value.trim()
        const email = inputs[1].value.trim()
        const password = inputs[2].value.trim()
        const confirmPassword = inputs[3].value.trim()

        if (password !== confirmPassword) {
            alert('Mật khẩu nhập lại không khớp!')
            return
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await updateProfile(user, {
                displayName: name
            })

            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                role: 'customer',
                newUserCouponUsed: false,
                createdAt: serverTimestamp()
            })

            localStorage.setItem('currentUser', JSON.stringify({
                uid: user.uid,
                name: name,
                email: email
            }))

            alert('Đăng ký thành công!')
            window.location.href = './index.html'
        } catch (error) {
            console.log(error)

            if (error.code === 'auth/email-already-in-use') {
                alert('Email này đã được đăng ký!')
            } else if (error.code === 'auth/weak-password') {
                alert('Mật khẩu phải có ít nhất 6 ký tự!')
            } else {
                alert('Đăng ký thất bại. Vui lòng thử lại!')
            }
        }
    })
})