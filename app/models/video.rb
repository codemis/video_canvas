class Video < ActiveRecord::Base

	has_many :annotations
	has_many :users, through: :annotations
	
	has_many :video_categories
	has_many :categories, through: :video_categories

	validates :video_url, :youtube_id, :presence => true

	def self.search_for_videos(title, category)
	  if title.present? && category.present?
	  	self.joins(:categories).where(["title ilike ? AND categories.name = ? AND private = ?", "#{title}", "#{category}", false])
	  elsif title.present?
	  	self.where("title ilike ? AND private = ?", "#{title}", false)
	  elsif category.present?
	  	self.joins(:categories).where(["categories.name = ? AND private = ?", "#{category}", false])
	  end
	end
end