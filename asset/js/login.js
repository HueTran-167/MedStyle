document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm')

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault()

        const email = document.getElementById('loginEmail').value.trim()
        const password = document.getElementById('loginPassword').value.trim()

        const users = JSON.parse(localStorage.getItem('users')) || []

        const user = users.find(function (item) {
            return item.email === email && item.password === password
        })

        if (!user) {
            const goRegister = confirm('Email này chưa có tài khoản hoặc sai mật khẩu. Bạn có muốn đăng ký không?')

            if (goRegister) {
                localStorage.setItem('registerEmail', email)
                window.location.href = 'register.html'
            }

            return
        }

        localStorage.setItem('currentUser', JSON.stringify(user))

        const redirect = localStorage.getItem('redirectAfterLogin') || 'index.html'
        localStorage.removeItem('redirectAfterLogin')

        alert('Đăng nhập thành công!')
        window.location.href = redirect
    })
})