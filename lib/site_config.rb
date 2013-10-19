class SiteConfig
  def self.load
    config_file = File.expand_path('../../config/site.yml', __FILE__)

    if File.exists?(config_file)
      if config = YAML.load_file(config_file)[Rails.env]

        config.each_pair do |key, val|
          cattr_accessor key
          send("#{key}=", val)
        end
      else
        puts "Failed to load site configuration for #{Rails.env} environment."
      end
    else
      warn "Failed to load site configuration. Did you create config/site.yml?"
    end
  end
end
