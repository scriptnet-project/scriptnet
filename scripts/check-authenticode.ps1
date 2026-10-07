param([Parameter(Mandatory=$true)][string]$Path)
$ErrorActionPreference = 'Stop'
(Get-AuthenticodeSignature -LiteralPath $Path).Status.ToString()
