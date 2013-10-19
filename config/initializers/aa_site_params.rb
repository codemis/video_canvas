# Named aa_site.rb so this is loaded first
# Need to do this so we can use SiteConfig.XYZ in other initializers
require 'site_config'
SiteConfig.load
