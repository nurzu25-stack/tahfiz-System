<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tahfiz Management System - Login</title>
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
        }

        .bg-custom-green {
            background-color: #6EB2AD;
        }

        .text-custom-green {
            color: #00A18A;
        }

        .bg-custom-teal {
            background-color: #9EC1C1;
        }

        .btn-role {
            transition: all 0.3s ease;
        }

        .btn-role:hover {
            background-color: #8DAFB0;
        }

        .role-radio:checked+.role-label {
            background-color: #8dafb0;
            border: 2px solid #fff;
        }

        .role-radio:checked+.role-label .check-circle {
            background-color: #fff;
        }
    </style>
</head>

<body class="flex min-h-screen">
    <!-- Left Section -->
    <div class="hidden lg:flex flex-col items-center justify-center w-1/2 p-12 bg-white relative">
        <button
            class="absolute top-8 left-8 px-6 py-2 bg-custom-teal text-white rounded-lg font-bold text-sm tracking-widest uppercase">BACK</button>

        <div class="flex flex-col items-center text-center">
            <!-- Replace with actual logo if available -->
            <h1 class="text-4xl md:text-5xl font-bold text-custom-green leading-tight">
                Tahfiz Management<br>System
            </h1>
        </div>
    </div>

    <!-- Right Section -->
    <div class="flex flex-col items-center justify-center w-full lg:w-1/2 bg-custom-green p-6 md:p-12">
        <div class="w-full max-w-lg bg-white rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div class="text-center mb-10">
                <h2 class="text-3xl font-bold text-[#2E3A59] mb-2 uppercase tracking-wide">WELCOME BACK</h2>
                <p class="text-gray-500 text-sm">Please log in to your account</p>
            </div>

            <form action="/login" method="POST">
                @csrf
                <div class="space-y-4 mb-8">
                    <!-- Admin Role -->
                    <label class="cursor-pointer">
                        <input type="radio" name="role" value="admin" class="hidden role-radio" required>
                        <div
                            class="role-label flex items-center p-4 bg-custom-teal rounded-2xl border-2 border-transparent hover:bg-[#8DAFB0] transition-all">
                            <div class="check-circle w-6 h-6 rounded-full border-2 border-white mr-4 bg-white/20 mb-1">
                            </div>
                            <div>
                                <h3 class="font-bold text-[#2E3A59] flex items-center">👑 Admin</h3>
                                <p class="text-xs text-[#2E3A59]/80">Full access to all system modules</p>
                            </div>
                        </div>
                    </label>

                    <!-- Teacher Role -->
                    <label class="cursor-pointer">
                        <input type="radio" name="role" value="teacher" class="hidden role-radio">
                        <div
                            class="role-label flex items-center p-4 bg-custom-teal rounded-2xl border-2 border-transparent hover:bg-[#8DAFB0] transition-all">
                            <div class="check-circle w-6 h-6 rounded-full border-2 border-white mr-4 bg-white/20"></div>
                            <div>
                                <h3 class="font-bold text-[#2E3A59] flex items-center">👨‍🏫 Teacher</h3>
                                <p class="text-xs text-[#2E3A59]/80">Access to student and progress management</p>
                            </div>
                        </div>
                    </label>

                    <!-- Parent Role -->
                    <label class="cursor-pointer">
                        <input type="radio" name="role" value="parent" class="hidden role-radio">
                        <div
                            class="role-label flex items-center p-4 bg-custom-teal rounded-2xl border-2 border-transparent hover:bg-[#8DAFB0] transition-all">
                            <div class="check-circle w-6 h-6 rounded-full border-2 border-white mr-4 bg-white/20"></div>
                            <div>
                                <h3 class="font-bold text-[#2E3A59] flex items-center">👪 Parent</h3>
                                <p class="text-xs text-[#2E3A59]/80">View child's progress and information</p>
                            </div>
                        </div>
                    </label>

                    <!-- Student Role -->
                    <label class="cursor-pointer">
                        <input type="radio" name="role" value="student" class="hidden role-radio">
                        <div
                            class="role-label flex items-center p-4 bg-custom-teal rounded-2xl border-2 border-transparent hover:bg-[#8DAFB0] transition-all">
                            <div class="check-circle w-6 h-6 rounded-full border-2 border-white mr-4 bg-white/20"></div>
                            <div>
                                <h3 class="font-bold text-[#2E3A59] flex items-center">🎓 Student</h3>
                                <p class="text-xs text-[#2E3A59]/80">View own progress and schedule</p>
                            </div>
                        </div>
                    </label>
                </div>

                <!-- Basic Credentials (Hidden or visible as needed, design shows LOGIN button) -->
                <div class="space-y-4 mb-6">
                    <input type="email" name="email" placeholder="Email Address" required
                        class="w-full p-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-custom-green">
                    <input type="password" name="password" placeholder="Password" required
                        class="w-full p-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-custom-green">
                </div>

                @if ($errors->any())
                    <div class="mb-4 text-red-500 text-sm">
                        {{ $errors->first() }}
                    </div>
                @endif

                <button type="submit"
                    class="w-full py-4 bg-[#4A4A4A] text-white rounded-xl font-bold text-lg uppercase tracking-widest hover:bg-[#333] transition-colors shadow-lg">
                    LOGIN
                </button>

                <div class="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p class="text-gray-500 text-sm italic">
                        Forgot Password? <a href="#" class="font-bold text-[#2E3A59] not-italic">Click here</a>
                    </p>
                    <p class="text-gray-500 text-sm mt-4 italic">
                        Don't have an account? <a href="/register"
                            class="font-bold text-[#2E3A59] not-italic underline">Register here</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
</body>

</html>