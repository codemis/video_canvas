namespace :db do
	desc "Erase and fill database with dummy data"
	task :populate => :environment do
		require 'populator'
		require 'faker'
		[User, Video, Annotation].each(&:delete_all)

		password = "password"

		5.times do |n|
			username = Faker::Internet.user_name
  			user = User.new
			user.username = "#{username}_#{n}"
			user.email = Faker::Internet.email
			user.encrypted_password = User.new(:password => password).encrypted_password
			user.avatar_text = User.generate_new_avatar_text(user.username)
			user.save
		end

		5.times do |n|
			video  = Video.new
			video.video_url = Faker::Internet.domain_name
			video.youtube_id = Faker::Internet.domain_word
			video.save
		end
	end
end
