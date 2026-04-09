<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pendaftaran Diterima</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #334155;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #6FC7CB 0%, #5FB3B7 100%);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.025em;
            text-transform: uppercase;
        }
        .content {
            padding: 40px;
        }
        .content h2 {
            color: #1e293b;
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
        }
        .details {
            background-color: #f1f5f9;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
        }
        .details-item {
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
        }
        .details-label {
            font-weight: 600;
            color: #64748b;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .details-value {
            font-weight: 700;
            color: #334155;
            font-size: 14px;
        }
        .footer {
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            background-color: #fdfdfd;
            border-top: 1px solid #f1f5f9;
        }
        .badge {
            display: inline-block;
            padding: 6px 12px;
            background-color: #6FC7CB;
            color: white;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #6FC7CB;
            color: #ffffff;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="badge">SISTEM TAHFIZ AMALILLAH</div>
            <h1>Pendaftaran Berjaya</h1>
        </div>
        <div class="content">
            <h2>Assalamu'alaikum, {{ $parent->name }}</h2>
            <p>Terima kasih kerana berminat untuk mendaftarkan anak anda di <strong>Akademi Al-Quran Amalillah (AKU)</strong>. Kami telah menerima permohonan anda.</p>
            
            <div class="details">
                <div class="details-item">
                    <span class="details-label">Nama Pelajar:</span>
                    <span class="details-value">{{ $student->name }}</span>
                </div>
                <div class="details-item">
                    <span class="details-label">Tarikh Daftar:</span>
                    <span class="details-value">{{ date('d/m/Y') }}</span>
                </div>
                <div class="details-item">
                    <span class="details-label">Status:</span>
                    <span class="details-value" style="color: #6FC7CB;">Menunggu Kelulusan Mudir</span>
                </div>
            </div>

            <p>Permohonan anda kini sedang dalam proses semakan. Mudir kami akan meneliti maklumat yang diberikan sebelum memberikan kelulusan untuk sesi temuduga.</p>
            
            <p>Anda akan menerima notifikasi seterusnya sebaik sahaja status permohonan anda dikemaskini.</p>

            <center>
                <a href="{{ config('app.url') }}" class="button">Log Masuk Portal Penjaga</a>
            </center>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Akademi Al-Quran Amalillah. Hak Cipta Terpelihara.<br>
            Pusat Tahfiz Swasta, Selangor, Malaysia.
        </div>
    </div>
</body>
</html>
