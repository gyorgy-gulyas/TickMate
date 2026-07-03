require "json"

# Local development pod for TickMate's iOS native modules (audio + bluetooth).
# Added to the Podfile via `pod 'TmNative', :path => './TmNative'` so CocoaPods
# compiles and links them — no manual .xcodeproj surgery, CI-friendly.
Pod::Spec.new do |s|
  s.name         = "TmNative"
  s.version      = "0.0.1"
  s.summary      = "TickMate native modules (low-latency audio + bluetooth status)"
  s.homepage     = "https://github.com/gyorgy-gulyas/TickMate"
  s.license      = { :type => "MIT" }
  s.author       = { "TickMate" => "noreply@tickmate.app" }
  s.platform     = :ios, "15.5"
  s.source       = { :path => "." }
  s.source_files = "*.{h,m,mm,swift}"
  s.swift_version = "5.0"
  s.requires_arc = true

  # Pull in the correct React deps for the active (new/old) architecture.
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end
