require 'base64'

class Annotation < ActiveRecord::Base
	store_accessor :position, :x1
	store_accessor :position, :y1
	store_accessor :position, :height
	store_accessor :position, :width
	attr_accessor :scribble_data

	belongs_to :user
	belongs_to :video

	validates_presence_of :user
	validates_presence_of :video
	validates :annotation_type, :start_time, :stop_time, :position, :presence => true

	# Save the Canvas image on disk
	#
	def save_scribble_image(scribble_data)
		new_image_path = File.join(Rails.root, 'public', 'system', 'annotations', "scribble_#{self.id}.png")
		scribble_image_data = Base64.decode64(scribble_data['data:image/png;base64,'.length .. -1])
		File.open(new_image_path, 'wb') do |f|
		  f.write scribble_image_data
		end
		self.content = new_image_path
		self.save
	end

	# Set the scribble_data param
	#
	def scribble_data
		if self.annotation_type == 'scribble'
			data = Base64.encode64(File.read(self.content)).gsub("\n", '')
			"data:image/png;base64,#{data}"
		end
	end

	# Add addition params to JSON by overriding as_json
	#
	def as_json(options)
		super(methods: [:scribble_data])
	end
end
