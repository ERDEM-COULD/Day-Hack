param (
    [string]$Message = "Varsayılan Mesaj"
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = 'Mesaj'
$form.Width = 400
$form.Height = 150
$form.TopMost = $true
$form.StartPosition = 'CenterScreen'

$label = New-Object System.Windows.Forms.Label
$label.Text = $Message
$label.AutoSize = $true
$label.Font = 'Microsoft Sans Serif,12'
$label.Location = New-Object System.Drawing.Point(20,40)

$form.Controls.Add($label)

$button = New-Object System.Windows.Forms.Button
$button.Text = 'Tamam'
$button.Width = 80
$button.Height = 30
$button.Location = New-Object System.Drawing.Point(($form.ClientSize.Width - $button.Width) / 2, 80)
$button.Add_Click({ $form.Close() })

$form.Controls.Add($button)

$form.Topmost = $true
$form.Add_Shown({$form.Activate()})
$form.ShowDialog()
