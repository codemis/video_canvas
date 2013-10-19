require 'base64'

class Annotation < ActiveRecord::Base
	store_accessor :position, :x1
	store_accessor :position, :y1
	store_accessor :position, :height
	store_accessor :position, :width
	belongs_to :user
	belongs_to :video

	validates_presence_of :user
	validates_presence_of :video
	validates :annotation_type, :start_time, :stop_time, :position, :presence => true

	# Save the Canvas image on disk
	#
	def save_canvas_image(canvas_data)
		new_image_path = File.join(Rails.root, 'public', 'system', 'annotations', "canvas_#{self.id}.png")
		canvas_image_data = Base64.decode64(canvas_data['data:image/png;base64,'.length .. -1])
		File.open(new_image_path, 'wb') do |f|
		  f.write canvas_image_data
		end
		self.content = new_image_path
		self.save
	end
end
