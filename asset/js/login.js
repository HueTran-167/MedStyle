import { auth } from './firebase-config.js'
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js'

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form')

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault()

        const inputs = loginForm.querySelectorAll('input')

        const email = inputs[0].value.trim()
        const password = inputs[1].value.trim()

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            localStorage.setItem('currentUser', JSON.stringify({
                uid: user.uid,
                name: user.displayName || email.split('@')[0],
                email: user.email
            }))

            alert('Đăng nhập thành công!')

            const redirectAfterLogin = localStorage.getItem('redirectAfterLogin')

            if (redirectAfterLogin) {
                localStorage.removeItem('redirectAfterLogin')
                window.location.href = redirectAfterLogin
            } else {
                window.location.href = './index.html'
            }
        } catch (error) {
            console.log(error)

            if (error.code === 'auth/user-not-found') {
                alert('Tài khoản không tồn tại!')
            } else if (error.code === 'auth/wrong-password') {
                alert('Mật khẩu không đúng!')
            } else if (error.code === 'auth/invalid-email') {
                alert('Email không hợp lệ!')
            } else {
                alert('Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu!')
            }
        }
    })
})