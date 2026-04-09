<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Surat Tawaran Rasmi</title>
    <style>
        @page {
            margin: 0cm 0cm;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 2.5cm;
            color: #333;
            line-height: 1.5;
        }
        .header {
            border-bottom: 2px solid #1A4D50;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        .logo-box {
            background-color: #1A4D50;
            color: #6FC7CB;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            font-size: 24px;
            font-weight: bold;
            display: inline-block;
            border-radius: 8px;
        }
        .header-content {
            float: right;
            text-align: right;
        }
        .ref-no {
            font-family: monospace;
            font-size: 12px;
            color: #666;
        }
        .label {
            font-size: 10px;
            font-weight: bold;
            color: #6FC7CB;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .title {
            font-size: 26px;
            font-weight: bold;
            color: #000;
            margin-top: 40px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .recipient {
            font-weight: bold;
            margin-bottom: 30px;
        }
        .body-text {
            margin-bottom: 30px;
        }
        .details-table {
            width: 100%;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            padding: 20px 0;
            margin: 30px 0;
        }
        .details-table td {
            vertical-align: top;
            width: 50%;
        }
        .detail-label {
            font-size: 10px;
            color: #999;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .detail-value {
            font-weight: bold;
            font-size: 16px;
        }
        .footer {
            position: fixed;
            bottom: 2.5cm;
            left: 2.5cm;
            right: 2.5cm;
        }
        .signatory {
            margin-top: 50px;
        }
    </style>
</head>
<body>
    <div class="header">
        @if($logo)
            <img src="{{ $logo }}" style="height: 60px; float: left;">
        @else
            <div class="logo-box">AKM</div>
        @endif
        <div class="header-content">
            <div class="label">Surat Tawaran Rasmi</div>
            <div class="ref-no">REF: AKM/OFF/{{ date('Y') }}/{{ $applicantId }}</div>
            <div class="ref-no">Tarikh: {{ date('d/m/Y') }}</div>
        </div>
        <div style="clear: both;"></div>
    </div>

    <div class="recipient">
        Kepada Tn/Puan {{ $parentName }},
    </div>

    <div class="title">
        Tawaran Kemasukan Pelajar Baharu
    </div>

    <div class="body-text">
        Dengan segala hormatnya, kami di <strong>Akademi Al-Quran Amalillah (AKMAL)</strong> amat sukacita memaklumkan bahawa anak anda, <strong>{{ $applicantName }}</strong>, telah berjaya dalam sesi temuduga dan ditawarkan tempat untuk mengikuti program pengajian di akademi kami.
    </div>

    <table class="details-table">
        <tr>
            <td>
                <div class="detail-label">Tarikh Pendaftaran</div>
                <div class="detail-value">15 JUN 2026</div>
            </td>
            <td>
                <div class="detail-label">Lokasi</div>
                <div class="detail-value">KAMPUS AKMAL</div>
            </td>
        </tr>
    </table>

    <div class="body-text">
        Sila bawa bersama dokumen-dokumen asal semasa hari pendaftaran untuk rujukan pihak akademi. Kami amat berharap agar kemasukan ini menjadi permulaan yang baik bagi perjalanan ukhrawi anak anda.
    </div>

    <div class="signatory">
        Yang benar,<br><br><br>
        <strong>Pihak Pengurusan</strong><br>
        Akademi Al-Quran Amalillah
    </div>

    <div class="footer">
        <div style="font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
            Akademi Al-Quran Amalillah &bull; Pusat Tahfiz Swasta &bull; Selangor, Malaysia
        </div>
    </div>
</body>
</html>
