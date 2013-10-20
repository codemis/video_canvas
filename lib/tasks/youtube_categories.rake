# setup API key
require_relative '../site_config'
SiteConfig.load

namespace :db do
  desc "Fill in categories table with category data from YouTube"
  task :update_youtube_categories => :environment do
    if !SiteConfig.respond_to?(:youtube_apikey)
      raise "You need a YouTube API key in your config/site.yml file!"
      exit
    end

    url = "https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=#{SiteConfig.youtube_apikey}"
    response = Net::HTTP.get_response(URI(url))
    data = JSON.parse(response.body)
    data['items'].each do |category|
      # I was going to do this by id - but the titles are not
      # unique. Comedy has versions that are assignable and not.
      # This happens to leave us with the new, assignable one.
      c = Category.find_or_create_by(name: category['snippet']['title'])
      c.update_attributes(youtube_id: category['id'])
      c.save!
    end
  end
end
