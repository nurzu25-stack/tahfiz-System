<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jemputan Temuduga Kemasukan</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase; }
        .content { padding: 40px; }
        .details { background-color: #fef3c7; border-radius: 16px; padding: 24px; margin: 24px 0; border: 1px solid #fde68a; }
        .details-item { margin-bottom: 12px; display: flex; justify-content: space-between; }
        .details-label { font-weight: 600; color: #92400e; font-size: 14px; text-transform: uppercase; }
        .details-value { font-weight: 700; color: #78350f; font-size: 14px; }
        .footer { padding: 30px; text-align: center; font-size: 12px; color: #94a3b8; background-color: #fdfdfd; border-top: 1px solid #f1f5f9; }
        .button { display: inline-block; padding: 14px 28px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 14px; font-weight: 800; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Jemputan Temuduga</h1>
        </div>
        <div class="content">
            <h2>Assalamu'alaikum, {{ $student->parent_name }}</h2>
            <p>Sukacita dimaklumkan bahawa permohonan anakanda <strong>{{ $student->name }}</strong> telah disenarai pendek untuk sesi temuduga kemasukan ke Akademi Al-Quran Amalillah (AKMAL).</p>
            
            <div class="details">
                <p style="text-align: center; font-weight: 800; font-size: 10px; color: #92400e; text-transform: uppercase; margin-bottom: 15px;">Butiran Temuduga</p>
                <div class="details-item">
                    <span class="details-label">Tarikh:</span>
                    <span class="details-value">{{ \Carbon\Carbon::parse($student->interview_date)->format('d/m/Y') }}</span>
                </div>
                <div class="details-item">
                    <span class="details-label">Masa:</span>
                    <span class="details-value">{{ \Carbon\Carbon::parse($student->interview_time)->format('h:i A') }}</span>
                </div>
                <div class="details-item">
                    <span class="details-label">Jenis:</span>
                    <span class="details-value">{{ $student->interview_type }}</span>
                </div>
                <div class="details-item">
                    <span class="details-label">Lokasi / Pautan:</span>
                    <span class="details-value">{{ $student->interview_location }}</span>
                </div>
            </div>

            <p>Sila pastikan anda dan anakanda bersedia 15 minit sebelum waktu yang dijadualkan. Untuk temuduga atas talian, pastikan capaian internet dalam keadaan baik.</p>
            
            <center>
                <a href="{{ config('app.url') }}" class="button">Log Masuk Portal</a>
            </center>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Akademi Al-Quran Amalillah. Hak Cipta Terpelihara.
        </div>
    </div>
</body>
</html>
