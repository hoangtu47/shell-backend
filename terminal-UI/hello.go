package main

import (
	"fmt"

	"github.com/gdamore/tcell/v2"
	"github.com/rivo/tview"
)

var (
	app      *tview.Application // The tview application.
	pages    *tview.Pages
	textView *tview.TextView
	menu     *tview.List
)

const what = `[::bu]What is this?[::-] ❓

My personal [::b]porfolio[::-], an interactive [::b]terminal-based[::-] website, follows [::b]Microservice[::-] architecture, facilitated by [::b]Serverless[::-] infrastructure.
`

const how = `[::bu]How it's built[::-] 👷‍♀️

* A SvelteKit front-end app uses Xterm.js to emulate terminal.

* CD/CI workflow for frontend is equipped by AWS Amplify.

* A JavaScript server establishes a Websocket connection to front-end.

* An Alpine container starts in the backend.

* A Golang binary in the container renders this TUI.

* Stdin and stdout of the restricted shell spawned inside the container are piped back and forth through Websocket.

* Backend is run on top Google Cloud serverless infrastructure.

Further details can be found in my repository: https://github.com/hoangtu47/haquocbao.id.vn 
`

const about = `[::bu]Xin chào! Mình là Quốc Bảo.[::-] 👋

[::bu]Hello! I'm Quoc Bao.[::-] 👋

[::bu]你好! 我叫国宝.[::-] 👋

An undergraduate at the University of Science, majors in Computer Networks and Telecommunications.

Also a basketball 🏀 and music 🎼 enthusiast.

I'm seeking for internship!

[::bu]Email:[::-] devnull@haquocbao.id.vn
[::bu]Phone number / Zalo:[::-] (+84) 857 705 305
[::bu]GitHub:[::-] https://github.com/hoangtu47
`

func main() {
	app = tview.NewApplication()

	textView = tview.NewTextView().
		SetDynamicColors(true)
	textView.SetBorder(true)
	textView.SetBorderPadding(1, 1, 2, 1)
	textView.SetWrap(true).SetWordWrap(true)
	textView.SetBackgroundColor(tcell.ColorLime)

	textView.SetInputCapture(func(event *tcell.EventKey) *tcell.EventKey {
		if event.Key() == tcell.KeyESC {
			app.SetFocus(menu)
		}
		return event
	})

	menu = tview.NewList().ShowSecondaryText(false)
	menu.SetBorder(true).SetTitle("Menu")
	menu.SetWrapAround(true).SetHighlightFullLine(true)
	menu.SetBorderPadding(1, 1, 2, 1)
	menu.SetSelectedBackgroundColor(tcell.ColorWhite)
	menu.SetBackgroundColor(tcell.ColorLime)

	menu.
		AddItem(" [::b]What", "", 0, func() {
			app.SetFocus(textView)
		}).
		AddItem(" [::b]How", "", 0, func() {
			app.SetFocus(textView)
		}).
		AddItem(" [::b]About", "", 0, func() {
			app.SetFocus(textView)
		}).
		AddItem(" [::b]Quit", "", 0, func() {
			app.Stop()
		})

	menu.SetChangedFunc(func(i int, mt, st string, sc rune) {
		switch i {
		case 0:
			printWhat()
		case 1:
			printHow()
		case 2:
			printAbout()
		}
	})

	printWhat()

	flex := tview.NewFlex().
		AddItem(menu, 0, 1, true).
		AddItem(textView, 0, 5, false)

	flexFrame := tview.NewFrame(flex).
		AddText(
			" [::b](c) 2024, Ha Quoc Bao.[::-] [::b]Up/Down[::-]: Navigate, [::b]Enter[::-]: Open item, [::b]Ctrl+C[::-]: Quit.",
			false,
			tview.AlignLeft,
			tcell.ColorWhite).
		SetBorders(0, 1, 0, 0, 0, 0)

	pages = tview.NewPages().
		AddPage("layout", flexFrame, true, true)

	app.SetRoot(pages, true).SetFocus(menu).EnableMouse(true).Run()
}

func printWhat() {
	textView.Clear()
	fmt.Fprintf(textView, "%s ", what)
	textView.SetTitle("CV")
}

func printHow() {
	textView.Clear()
	fmt.Fprintf(textView, "%s ", how)
	textView.SetTitle("How")
}
func printAbout() {
	textView.Clear()
	fmt.Fprintf(textView, "%s ", about)
	textView.ScrollToBeginning()
	textView.SetTitle("Hello")
}
