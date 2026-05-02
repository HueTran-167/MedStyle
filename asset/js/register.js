document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm')
    const registerEmail = document.getElementById('registerEmail')

    const savedEmail = localStorage.getItem('registerEmail')

    if (savedEmail) {
        registerEmail.value = savedEmail
        localStorage.removeItem('registerEmail')
    }

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault()

        const name = document.getElementById('registerName').value.trim()
        const email = document.getElementById('registerEmail').value.trim()
        const password = document.getElementById('registerPassword').value.trim()
        const confirmPassword = document.getElementById('confirmPassword').value.trim()

        if (password !== confirmPassword) {
            alert('Mật khẩu nhập lại không khớp!')
            return
        }

        const users = JSON.parse(localStorage.getItem('users')) || []

        const emailExists = users.some(function (user) {
            return user.email === email
        })

        if (emailExists) {
            alert('Email này đã được đăng ký. Vui lòng đăng nhập!')
            window.location.href = 'login.html'
            return
        }

        const newUser = {
            name: name,
            email: email,
            password: password
        }

        users.push(newUser)

        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('currentUser', JSON.stringify(newUser))

        alert('Đăng ký thành công!')

        const redirect = localStorage.getItem('redirectAfterLogin') || 'index.html'
        localStorage.removeItem('redirectAfterLogin')

        window.location.href = redirect
    })
})