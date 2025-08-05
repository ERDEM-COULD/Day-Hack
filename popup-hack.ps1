param (
    [string]$Message = "HACKLENIYORSUN!",
    [int]$Delay = 300
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

while ($true) {
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Uyarı!"
    $form.Width = 300
    $form.Height = 120
    $form.TopMost = $true
    $form.StartPosition = 'CenterScreen'

    $label = New-Object System.Windows.Forms.Label
    $label.Text = $Message
    $label.AutoSize = $true
    $label.Font = 'Microsoft Sans Serif,16,style=Bold'
    $label.Location = New-Object System.Drawing.Point(20,40)
    $form.Controls.Add($label)

    $form.Show()
    Start-Sleep -Milliseconds $Delay
}
