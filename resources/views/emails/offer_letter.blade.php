<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Surat Tawaran Kemasukan</title>
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
            background: linear-gradient(135deg, #1A4D50 0%, #6FC7CB 100%);
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
            background-color: #ffffff20;
            color: white;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 10px;
            margin-bottom: 10px;
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255,255,255,0.3);
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #1A4D50;
            color: #6FC7CB;
            text-decoration: none;
            border-radius: 14px;
            font-weight: 800;
            margin-top: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="badge">TAWARAN RASMI - AKADEMI AL-QURAN AMALILLAH</div>
            <h1>Tahniah & Syabas!</h1>
        </div>
        <div class="content">
            <h2>Assalamu'alaikum, {{ $student->parent_name }}</h2>
            <p>Sukacita dimaklumkan bahawa anakanda <strong>{{ $student->name }}</strong> telah berjaya dalam sesi temuduga dan secara rasminya **DITAWARKAN KEMASUKAN** ke Akademi Al-Quran Amalillah (AKMAL).</p>
            
            <div class="details">
                <p style="text-align: center; font-weight: 800; font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 15px;">Ringkasan Tawaran</p>
                <div class="details-item">
                    <span class="details-label">Nama Pelajar:</span>
                    <span class="details-value">{{ $student->name }}</span>
                </div>
                <div class="details-item">
                    <span class="details-label">Purata Markah:</span>
                    <span class="details-value">{{ round(($student->hafazan_mark + $student->tajwid_mark + $student->akhlaq_mark) / 3) }}%</span>
                </div>
                <div class="details-item">
                    <span class="details-label">Tarikh Lapor Diri:</span>
                    <span class="details-value">15 Jun 2026</span>
                </div>
                <div class="details-item">
                    <span class="details-label">Status:</span>
                    <span class="details-value" style="color: #059669;">LAYAK (OFFERED)</span>
                </div>
            </div>

            <p>Bersama e-mel ini dilampirkan **Surat Tawaran Rasmi (PDF)** yang mengandungi perincian yuran dan prosedur pendaftaran.</p>
            
            <p>Sila log masuk ke Portal Penjaga untuk melakukan pengesahan penerimaan tawaran dan pembayaran yuran pendaftaran.</p>

            <center>
                <a href="{{ config('app.url') }}/app/parent/dashboard" class="button">Log Masuk Portal Penjaga</a>
            </center>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Akademi Al-Quran Amalillah. Hak Cipta Terpelihara.<br>
            Pusat Tahfiz Swasta, Selangor, Malaysia.
        </div>
    </div>
</body>
</html>
