<?php
/**
 * Directory Browser Script
 * 
 * Lists all files and folders within a specified base directory.
 */

// ini_set('display_errors', 1);
// error_reporting(E_ALL);

$baseDirectory = __DIR__; // Set to current directory
$currentDirectory = $baseDirectory;

// Check for directory traversal
if (isset($_GET['folder'])) {
    $folder = $_GET['folder'];
    if (strpos($folder, '..') !== false || strpos($folder, '\\') !== false) {
        // Less strict check: allow '/' but ensure it doesn't traverse up
        echo 'Access Denied';
        exit;
    }
    // Simple sanitization
    $folder = str_replace(['../', '..\\'], '', $folder);
    
    // Construct path
    $requestedPath = realpath($baseDirectory . '/' . $folder);
    
    // Verify it is inside base directory
    if ($requestedPath && strpos($requestedPath, realpath($baseDirectory)) === 0 && is_dir($requestedPath)) {
         $currentDirectory = $requestedPath;
    } else {
        echo 'Directory not found or access denied';
        exit;
    }
}

// Extracting the name of the current directory
$currentDirName = basename($currentDirectory);

// Determine the depth of the current directory relative to the base directory
$depth = substr_count(str_replace($baseDirectory, '', $currentDirectory), '/');

// Header
echo '<!DOCTYPE html><html><head><title>Index of ' . htmlspecialchars($currentDirName) . '</title>';

// Carbon & Swiss Theme Scripts/CSS
echo '<script type="module" src="/libs/load-carbon.js"></script>';
echo '<link rel="stylesheet" href="/prototipo/assets/style.css">'; // Absolute path for style
echo '<style>body { padding-top: 3rem; } .main-container { padding: 2rem; max-width: 1000px; margin: 0 auto; }</style>';
echo '</head><body>';

// UI Shell Header
echo '
<cds-header aria-label="PNA Platform">
    <cds-header-menu-button button-label-active="Close menu" button-label-inactive="Open menu"></cds-header-menu-button>
    <cds-header-name href="/index.html" prefix="PNA">Platform</cds-header-name>
    <cds-header-nav menu-bar-label="PNA Platform">
        <cds-header-nav-item href="/prototipo/index.html">Prototipo</cds-header-nav-item>
        <cds-header-nav-item href="/viz/index.html">Infografiche</cds-header-nav-item>
        <cds-header-nav-item href="/docs/">Docs</cds-header-nav-item>
        <cds-header-nav-item href="/data/">Data</cds-header-nav-item>
    </cds-header-nav>
</cds-header>
';

echo '<div class="main-container">';
echo "<h1>Index of /" . htmlspecialchars($currentDirName) . "</h1>";

$contents = scandir($currentDirectory);

if ($contents) {
	echo "<ul class='bx--list--unordered'>";
	foreach ($contents as $item) {
		if ($item !== "." && $item !== "..") {
			$itemPath = $currentDirectory . '/' . $item;
			$isDir = is_dir($itemPath);
			$displayName = $item;
			if ($isDir) $displayName .= "/";

			if ($isDir) {
                // Folder logic
                $relPath = str_replace($baseDirectory . '/', '', $itemPath);
                $queryParam = urlencode($relPath);
                echo "<li><strong>[DIR]</strong> <a href='?folder={$queryParam}'>" . htmlspecialchars($displayName) . "</a></li>";
			} else {
                // File link
				echo "<li><a href='" . htmlspecialchars($item) . "' target='_blank'>" . htmlspecialchars($displayName) . "</a></li>";
			}
		}
	}
	echo "</ul>";

	// Back link
	if ($currentDirectory != $baseDirectory) {
		echo "<br><cds-button href='javascript:history.back()'>Go Back</cds-button>";
	}
} else {
    echo "Cannot access or read directory.";
}

echo '</div></body></html>';
