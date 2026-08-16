<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    body { font-family: Arial, sans-serif; font-size: 11px; color: #333; }
    h1   { color: #1a3c5e; font-size: 16px; margin-bottom: 4px; }
    p.sub{ color: #666; font-size: 10px; margin-top: 0; }
    table{ width: 100%; border-collapse: collapse; margin-top: 12px; }
    th   { background: #1a3c5e; color: #fff; padding: 6px 8px; text-align: left; font-size: 10px; }
    td   { padding: 5px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
    tr:nth-child(even) td { background: #f5f7fa; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: bold; }
    .high    { background:#fee2e2; color:#991b1b; }
    .critical{ background:#7f1d1d; color:#fff; }
    .medium  { background:#fef3c7; color:#92400e; }
    .low     { background:#d1fae5; color:#065f46; }
</style>
</head>
<body>
<h1>EOCO — Crime Reports Export</h1>
<p class="sub">Generated: {{ $date }} &nbsp;|&nbsp; Total records: {{ $reports->count() }}</p>

<table>
    <thead>
        <tr>
            <th>Reference</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Location</th>
            <th>Anonymous</th>
            <th>Created</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($reports as $r)
        <tr>
            <td>{{ $r->reference_no }}</td>
            <td>{{ Str::limit($r->title, 40) }}</td>
            <td>{{ $r->category?->name ?? '—' }}</td>
            <td>{{ str_replace('_', ' ', ucfirst($r->status)) }}</td>
            <td><span class="badge {{ $r->priority }}">{{ strtoupper($r->priority) }}</span></td>
            <td>{{ $r->location ?? '—' }}</td>
            <td>{{ $r->is_anonymous ? 'Yes' : 'No' }}</td>
            <td>{{ $r->created_at?->format('d M Y') }}</td>
        </tr>
        @empty
        <tr><td colspan="8" style="text-align:center;color:#999;">No reports found.</td></tr>
        @endforelse
    </tbody>
</table>
</body>
</html>
