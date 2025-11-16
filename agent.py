import subprocess
import sys
import webbrowser
import json
import argparse
import tkinter as tk
from tkinter import messagebox
from tkinter import font as tkfont
from tkinter import ttk

def is_yt_dlp_available():
    try:
        subprocess.run(["yt-dlp", "--version"], capture_output=True, text=True, check=True)
        return True
    except Exception:
        return False

def search_top_video(query):
    try:
        result = subprocess.run(
            ["yt-dlp", "-j", "--flat-playlist", f"ytsearch1:{query}"],
            capture_output=True, text=True, check=True
        )
        if result.stdout:
            line = result.stdout.strip().splitlines()[0]
            video = json.loads(line)
            return video.get("title"), f"https://www.youtube.com/watch?v={video.get('id')}"
        return None, None
    except Exception:
        return None, None

def find_youtube_video(query, open_in_browser=True):
    title, url = search_top_video(query)
    if title and url:
        print(f"Top result: {title} \n{url}")
        if open_in_browser:
            webbrowser.open(url)
        return title, url
    print("No results found.")
    return None, None

def create_gui():
    def hex_to_rgb(h):
        h = h.lstrip('#')
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

    def rgb_to_hex(r, g, b):
        return '#%02x%02x%02x' % (r, g, b)

    def lerp_color(c1, c2, t):
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        return rgb_to_hex(r, g, b)

    def draw_vertical_gradient(canvas, w, h, c1, c2):
        c1r = hex_to_rgb(c1)
        c2r = hex_to_rgb(c2)
        steps = max(h, 1)
        canvas.delete('grad')
        for i in range(steps):
            t = i / steps
            color = lerp_color(c1r, c2r, t)
            canvas.create_line(0, i, w, i, fill=color, tags='grad')

    def set_button_hover_style(btn, style_obj, style_name, normal, hover):
        def on_enter(_):
            style_obj.configure(style_name, background=hover)
        def on_leave(_):
            style_obj.configure(style_name, background=normal)
        btn.bind('<Enter>', on_enter)
        btn.bind('<Leave>', on_leave)

    def pulse_button_style(btn, style_obj, style_name, a, b):
        state = {'toggle': False}
        def step():
            state['toggle'] = not state['toggle']
            color = b if state['toggle'] else a
            style_obj.configure(style_name, background=color)
            btn.after(700, step)
        step()

    root = tk.Tk()
    root.title("YouTube Finder")
    root.configure(bg='#0f172a')

    title_font = tkfont.Font(family='Helvetica', size=20, weight='bold')
    text_font = tkfont.Font(family='Helvetica', size=12)

    header = tk.Canvas(root, height=140, highlightthickness=0, bg='#0f172a')
    header.pack(fill='x', side='top')

    def redraw_header(_=None):
        w = header.winfo_width()
        draw_vertical_gradient(header, w, 140, '#7c3aed', '#22d3ee')
        header.delete('title')
        header.create_text(24, 40, text='YouTube Finder', anchor='nw', font=title_font, fill='#0e0e10', tags='title')
        header.create_text(20, 36, text='YouTube Finder', anchor='nw', font=title_font, fill='#ffffff', tags='title')
    header.bind('<Configure>', redraw_header)

    content = tk.Frame(root, bg='#111827')
    content.pack(fill='both', expand=True)

    tk.Label(content, text='Topic', font=text_font, fg='#e5e7eb', bg='#111827').grid(row=0, column=0, padx=12, pady=12, sticky='w')
    entry = tk.Entry(content, width=48, fg='#e5e7eb', bg='#1f2937', insertbackground='#e5e7eb')
    entry.grid(row=0, column=1, padx=12, pady=12, sticky='w')
    entry.insert(0, 'Type a topic...')

    def clear_placeholder(_):
        if entry.get() == 'Type a topic...':
            entry.delete(0, 'end')
    def restore_placeholder(_):
        if not entry.get().strip():
            entry.insert(0, 'Type a topic...')
    entry.bind('<FocusIn>', clear_placeholder)
    entry.bind('<FocusOut>', restore_placeholder)

    auto_var = tk.BooleanVar(value=True)
    tk.Checkbutton(content, text='Open in browser', variable=auto_var, fg='#e5e7eb', bg='#111827', activeforeground='#e5e7eb', activebackground='#111827', selectcolor='#111827').grid(row=1, column=1, padx=12, pady=4, sticky='w')

    result_title = tk.StringVar()
    result_url = tk.StringVar()
    title_label = tk.Label(content, textvariable=result_title, wraplength=520, justify='left', font=text_font, fg='#e5e7eb', bg='#111827')
    url_label = tk.Label(content, textvariable=result_url, fg='#93c5fd', bg='#111827', cursor='hand2')
    title_label.grid(row=2, column=0, columnspan=2, padx=12, pady=6, sticky='w')
    url_label.grid(row=3, column=0, columnspan=2, padx=12, pady=6, sticky='w')

    def fade_in_label(lbl, start, end, steps=12, delay=40):
        s = hex_to_rgb(start)
        e = hex_to_rgb(end)
        idx = {'i': 0}
        def step():
            t = idx['i'] / max(steps, 1)
            col = lerp_color(s, e, t)
            lbl.configure(fg=col)
            idx['i'] += 1
            if idx['i'] <= steps:
                lbl.after(delay, step)
        step()

    def on_search():
        q = entry.get().strip()
        if not q or q == 'Type a topic...':
            messagebox.showwarning('Input required', 'Enter a topic')
            return
        if not is_yt_dlp_available():
            messagebox.showerror('Missing dependency', 'yt-dlp is not available')
            return
        title, url = find_youtube_video(q, open_in_browser=auto_var.get())
        if title and url:
            result_title.set(f'Top result: {title}')
            result_url.set(url)
            fade_in_label(title_label, '#6b7280', '#e5e7eb')
            fade_in_label(url_label, '#64748b', '#93c5fd')
        else:
            messagebox.showinfo('No results', 'No results found')

    def on_open_link(_=None):
        u = result_url.get().strip()
        if u:
            webbrowser.open(u)

    style = ttk.Style(root)
    try:
        style.theme_use('clam')
    except Exception:
        pass

    search_btn = ttk.Button(content, text='Search', command=on_search)
    open_btn = ttk.Button(content, text='Open Link', command=on_open_link)
    search_btn.grid(row=1, column=0, padx=12, pady=12, sticky='w')
    open_btn.grid(row=4, column=0, padx=12, pady=12, sticky='w')

    search_style = f"Primary_{search_btn.winfo_id()}.TButton"
    open_style = f"Secondary_{open_btn.winfo_id()}.TButton"
    style.configure(search_style, foreground='#ffffff', background='#4f46e5', font=text_font, borderwidth=0, focusthickness=0)
    style.configure(open_style, foreground='#ffffff', background='#374151', font=text_font, borderwidth=0, focusthickness=0)
    style.map(search_style, background=[('pressed', '#6366f1'), ('active', '#6366f1')], foreground=[('pressed', '#ffffff'), ('active', '#ffffff')])
    style.map(open_style, background=[('pressed', '#4b5563'), ('active', '#4b5563')], foreground=[('pressed', '#ffffff'), ('active', '#ffffff')])
    search_btn.configure(style=search_style)
    open_btn.configure(style=open_style)

    set_button_hover_style(search_btn, style, search_style, '#4f46e5', '#6366f1')
    set_button_hover_style(open_btn, style, open_style, '#374151', '#4b5563')
    pulse_button_style(search_btn, style, search_style, '#4f46e5', '#8b5cf6')
    url_label.bind('<Button-1>', on_open_link)

    redraw_header()
    root.mainloop()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("topic", nargs="*")
    parser.add_argument("--gui", action="store_true")
    args = parser.parse_args()
    if args.gui:
        create_gui()
    else:
        topic = " ".join(args.topic) if args.topic else input("Enter a YouTube search topic: ")
        find_youtube_video(topic)
