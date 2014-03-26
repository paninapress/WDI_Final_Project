class User < ActiveRecord::Base
  belongs_to :first_name
  belongs_to :last_name
  has_one :linkedin
  has_many :connections
  has_one :picture

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


    # USER CREATION

    user = nil
    contact = nil

    li_id = (Linkedin.find_by(linkedin_id: auth.uid))
    # if the LinkedIn ID is already in DB:
    if li_id != nil
      # check to see if user is already in DB as a LinkedIn user (and thus is a contact)
      if li_id.user != nil
        user = User.find(Linkedin.find_by(linkedin_id: auth.uid).user_id)
        contact = Contact.find(Linkedin.find_by(linkedin_id: auth.uid).contact_id)
      #else check to see if ID is in database but not assigned to user (but may be a contact)
      else
        user = User.create()
        contact = Contact.find(Linkedin.find_by(Linkedin_id: auth.uid).contact_id)
        if (contact == nil)
          contact = Contact.create()
          li_id.contact = contact
        end
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
    picture = Picture.find_by(linkedin_pic: auth.info.image) || Picture.create(linkedin_pic: auth.info.image)
    first_name.users << user
    last_name.users << user
    user.picture = picture
    contact.picture = picture

    # create/update user's connections:
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
      # create/update names/picture
      first_name = FirstName.find_by(name: c['firstName']) || FirstName.create(name: c['firstName'])
      last_name = LastName.find_by(name: c['lastName']) || LastName.create(name: c['lastName'])
      picture = Picture.find_by(linkedin_pic: c.pictureUrl) || Picture.create(linkedin_pic: c.pictureUrl)
      first_name.connections << connection
      last_name.connections << connection
      contact.picture = picture
    end
  end

  def get_contacts user
    # assemble a 'contacts' array with all of the user's connections
    # need first_name, last_name, linkedin_id, category
    contacts = []
    list = Connection.where(user_id: user.id)
    list.each do |contact|
      item = {
              id: Linkedin.find_by(contact_id: contact.contact_id).linkedin_id,
              first_name: FirstName.find(contact.first_name_id).name,
              last_name: LastName.find(contact.last_name_id).name,
              category: contact.category
              }
      contacts << item
    end
    # return the 'contacts' array
    contacts
    # Input the following into Angular view for drop-down sorting:
      # <input type="text" ng-model="query" />
      #   <select ng-model="contactSort">
      #     <option value="first_name">First Name</option>
      #     <option value="last_name"> Last Name</option>
      #     <option value="category">Category</option>
      #   </select>
      # <div ng-repeat="contact in contacts | filter: query | orderBy: contactSort">
      #   ...
      # </div>
  end
end




