<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AppNotification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        return AppNotification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function update(Request $request, string $id)
    {
        $notif = AppNotification::findOrFail($id);
        if ($notif->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notif->update($request->only('is_read'));
        return $notif;
    }

    public function markAllAsRead(Request $request)
    {
        AppNotification::where('user_id', $request->user()->id)
            ->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }

    public function destroy(Request $request, string $id)
    {
        $notif = AppNotification::findOrFail($id);
        if ($notif->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $notif->delete();
        return response()->json(['success' => true]);
    }
}
