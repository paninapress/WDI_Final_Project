class User < ActiveRecord::Base
  belongs_to :first_name
  belongs_to :last_name
  has_one :linkedin
  has_many :connections

  def self.create_with_omniauth auth
    # auth == request.env['omniauth.auth']

    provider = auth.provider
    linkedin_connections_array = auth.extra.raw_info.connections.values[1]

      # LinkedIn connections values:
        # linkedin_connections_array.each do |connection|
        #   id             =  connection.id
        #   first_name     =  connection.firstName
        #   last_name      =  connection.lastName
        #   industry       =  connection.industry
        #   location       =  connection.location.name
        #   picture_url    =  connection.pictureUrl
        #   linkedin_url   =  connection.siteStandardProfileRequest.url

    # access_token = auth.credentials.token
    # token_expiration = auth.credentials.expires_at
    # token_expires = auth.credentials.expires

    # uid = auth.uid
    # first_name = auth.info.first_name
    # last_name = auth.info.last_name
    # picture = auth.info.image


    # USER CREATION -- UNTIL WE GET CURRENT_USER

    user = nil
    contact = nil

    li_id = (Linkedin.find_by(linkedin_id: auth.uid))
    # if the LinkedIn ID is already in DB:
    if li_id != nil
      # check to see if user is already in DB as a LinkedIn user
      if li_id.user != nil
        user = User.find(Linkedin.find_by(linkedin_id: auth.uid).user_id)
      #else check to see if ID is in database but not assigned to user
      else
        user = User.create()
        li_id.user = user
      end
    # else if LinkedIn ID is NOT in DB:
    else
      user = User.create()
      linkedin = Linkedin.create(linkedin_id: auth.uid)
      user.linkedin = linkedin
      contact = Contact.create()
      contact.linkedin = linkedin
    end
    # we now have our user -- set/reset first name, last name, picture
    first_name = FirstName.find_by(name: auth.info.first_name) || FirstName.create(name: auth.info.first_name)
    last_name = LastName.find_by(name: auth.info.last_name) || LastName.create(name: auth.info.last_name)
    first_name.users << user
    last_name.users << user
    # user.picture = auth.info.image
    # contact.picture = auth.info.image


    # Now to create/update all the user's connections:
    linkedin_connections_array.each do |c|
      # 1.a) look for existing LinkedIN ID in DB
      if (Linkedin.find_by(linkedin_id: c.id))
        contact = Contact.find(Linkedin.find_by(linkedin_id: c.id).contact_id)
      # 1.b) if not in DB, need to create the contact
      else
        contact = Contact.create()
        contact.linkedin = Linkedin.create(linkedin_id: c.id)
      end
      # 2) create/update the connection between user and contact
      connection = Connection.where(user_id: user.id).where(contact_id: contact.id)
        # create connection if none exist
      if (connection.empty?)
        connection = Connection.create()
        user.connections << connection
        contact.connections << connection
      end
      # create/update names
      first_name = FirstName.find_by(name: c['firstName']) || FirstName.create(name: c['firstName'])
      last_name = LastName.find_by(name: c['lastName']) || LastName.create(name: c['lastName'])
      first_name.connections << connection
      last_name.connections << connection
    end


  end

end
