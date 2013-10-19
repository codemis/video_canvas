require 'base64'

class AnnotationsController < ApplicationController
	def save_image
		new_image_path = File.join(Rails.root, 'public', 'system', 'annotations', params['uuid'] + ".png")
		@image_data = {uuid: params['uuid'], path: new_image_path}
		data = params[:image_data]
		image_data = Base64.decode64(data['data:image/png;base64,'.length .. -1])
		File.open(new_image_path, 'wb') do |f|
		  f.write image_data
		end

		respond_to do |format|
			format.json {render json: @image_data}
		end
	end
end
